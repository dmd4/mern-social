import { AuthenticationError, UserInputError } from 'apollo-server';

import Post from '../../models/Post';
import checkAuth from '../../util/check-auth';

export const postsResolvers = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err: any) {
        throw new Error(err);
      }
    },
    async getPost(_: any, { postId }: { postId: string }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error('Post not found');
        }
      } catch (err: any) {
        throw new Error(err);
      }
    },
    async searchPosts(_: any, { searchTerm }: { searchTerm: string }) {
      try {
        if (!searchTerm || searchTerm.trim() === '') {
          return await Post.find().sort({ createdAt: -1 });
        }
        const posts = await Post.find(
          { $text: { $search: searchTerm } },
          { score: { $meta: 'textScore' } }
        ).sort({ score: { $meta: 'textScore' } });
        return posts;
      } catch (err: any) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createPost(_: any, { body }: { body: string }, context: any) {
      const user = checkAuth(context);

      if (body.trim() === '') {
        throw new Error('Post must not be empty');
      }

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });

      const post = await newPost.save();

      context.pubsub.publish('NEW_POST', {
        newPost: post
      });

      return post;
    },
    async deletePost(_: any, { postId }: { postId: string }, context: any) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (post) {
          if (user.username === post.username) {
            await post.deleteOne();
            return 'Successfully delete post';
          } else {
            throw new AuthenticationError('Action not allowed');
          }
        } else {
          throw new Error('Post not found');
        }
      } catch (err: any) {
        throw new Error(err);
      }
    },
    async likePost(_: any, { postId }: { postId: string }, context: any) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          // Post already liked, unlike it
          post.likes = post.likes.filter((like) => like.username !== username) as any;
        } else {
          // Not liked, like post
          post.likes.push({
            username,
            createdAt: new Date().toISOString()
          } as any);
        }

        await post.save();
        return post;
      } else throw new UserInputError('Post not found');
    }
  },
  Subscription: {
    newPost: {
      subscribe: (_: any, __: any, { pubsub }: any) => pubsub.asyncIterator('NEW_POST')
    }
  }
};

export default postsResolvers;
