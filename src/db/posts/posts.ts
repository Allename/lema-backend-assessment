import { connection } from "../connection";
import {
  selectPostsTemplate,
  deletePostTemplate,
  insertPostTemplate,
  checkUserExistsTemplate,
} from "./query-templates";
import { Post } from "./types";
import { randomBytes } from "crypto";

export const getPosts = (userId: string): Promise<Post[]> =>
  new Promise((resolve, reject) => {
    connection.all(
      selectPostsTemplate,
      [userId],
      (error: Error | null, results: Post[]) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      }
    );
  });

export const deletePost = (postId: string): Promise<boolean> =>
  new Promise((resolve, reject) => {
    connection.run(
      deletePostTemplate,
      [postId],
      function (this: { changes: number }, error: Error | null) {
        if (error) {
          reject(error);
        }
        // this.changes returns the number of rows affected
        resolve(this.changes > 0);
      }
    );
  });

export const checkUserExists = (userId: string): Promise<boolean> =>
  new Promise((resolve, reject) => {
    connection.get(
      checkUserExistsTemplate,
      [userId],
      (error: Error | null, result: { id: string } | undefined) => {
        if (error) {
          reject(error);
        }
        resolve(!!result);
      }
    );
  });

export const createPost = (
  userId: string,
  title: string,
  body: string
): Promise<Post> =>
  new Promise((resolve, reject) => {
    const id = randomBytes(16).toString("hex");
    const createdAt = new Date().toISOString();

    connection.run(
      insertPostTemplate,
      [id, userId, title, body, createdAt],
      function (error: Error | null) {
        if (error) {
          reject(error);
        }

        const newPost: Post = {
          id,
          user_id: userId,
          title,
          body,
          created_at: createdAt,
        };

        resolve(newPost);
      }
    );
  });
