import { Router, Request, Response } from "express";

import { getUsers, getUsersCount } from "../db/users/users";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const pageNumber = Number(req.query.pageNumber) || 0;
    const pageSize = Number(req.query.pageSize) || 4;

    if (pageNumber < 0 || pageSize < 1) {
      res.status(400).send({ error: "Invalid page number or page size" });
      return;
    }

    const users = await getUsers(pageNumber, pageSize);
    res.status(200).send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ error: "Failed to fetch users" });
  }
});

router.get("/count", async (req: Request, res: Response) => {
  try {
    const count = await getUsersCount();
    res.status(200).send({ count });
  } catch (error) {
    console.error("Error fetching user count:", error);
    res.status(500).send({ error: "Failed to fetch user count" });
  }
});

export default router;
