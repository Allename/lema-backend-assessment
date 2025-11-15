import { connection } from "../connection";

import {
  selectCountOfUsersTemplate,
  selectUsersTemplate,
} from "./query-templates";
import { User } from "./types";

interface UserRow {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  address_id: string | null;
  street: string | null;
  state: string | null;
  city: string | null;
  zipcode: string | null;
}

export const getUsersCount = (): Promise<number> =>
  new Promise((resolve, reject) => {
    connection.get<{ count: number }>(
      selectCountOfUsersTemplate,
      (error: Error | null, results: { count: number }) => {
        if (error) {
          reject(error);
        }
        resolve(results.count);
      }
    );
  });

export const getUsers = (
  pageNumber: number,
  pageSize: number
): Promise<User[]> =>
  new Promise((resolve, reject) => {
    connection.all<UserRow>(
      selectUsersTemplate,
      [pageNumber * pageSize, pageSize],
      (error: Error | null, results: UserRow[]) => {
        if (error) {
          reject(error);
        }

        // Transform the results to include address as a nested object
        const users: User[] = results.map((row: UserRow) => {
          const user: User = {
            id: row.id,
            name: row.name,
            username: row.username,
            email: row.email,
            phone: row.phone,
          };

          // Add address if it exists
          if (row.address_id && row.street && row.state && row.city && row.zipcode) {
            user.address = {
              id: row.address_id,
              user_id: row.id,
              street: row.street,
              state: row.state,
              city: row.city,
              zipcode: row.zipcode,
            };
          }

          return user;
        });

        resolve(users);
      }
    );
  });
