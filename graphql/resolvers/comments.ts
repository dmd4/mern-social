import { AuthenticationError, UserInputError } from 'apollo-server';

import checkAuth from '../../util/check-auth';
import Post from '../../models/Post';

export const commentsResolvers = {
  Mutation: {
    createComment: async (_: any, { postId, body }: { postId: string; body: string }, context: any) => {
      const { username } = checkAuth(context);
      if (body.trim() === '') {
        throw new UserInputError('Empty comment', {
          errors: {
            body: 'Comment must not be empty'
          }
        });
      }
      const post = await Post.findById(postId);
      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString()
        } as any);
        await post.save();
        return post;
      } else throw new UserInputError('Post not found');
    },
    async deleteComment(_: any, { postId, commentId }: { postId: string; commentId: string }, context: any) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);

      if (post) {
        const commentIndex = post.comments.findIndex((c: any) => c.id === commentId || c._id?.toString() === commentId);

        if (commentIndex !== -1 && post.comments[commentIndex].username === username) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } else {
        throw new UserInputError('Post not found');
      }
    }
  }
};

export default commentsResolvers;
