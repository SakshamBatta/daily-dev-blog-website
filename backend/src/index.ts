import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, jwt, sign, verify } from "hono/jwt";
import { cors } from "hono/cors";
import {
  signinInput,
  signupInput,
  createPostInput,
  updatePostInput,
} from "@sakshambatta/medium-common";

const app = new Hono();
app.use("/*", cors());

app.use("/api/v1/blog/*", async (c, next) => {
  const header = c.req.header("Authorization") || "";

  //@ts-ignore
  const response = await verify(header, c.env.JWT_SECRET);

  if (response.id) {
    //@ts-ignore
    c.env.token = header;
    //@ts-ignore
    c.env.userId = response.id;
    await next();
  } else {
    c.status(403);
    return c.json({
      error: "Unauthorised",
    });
  }
});

app.post("/api/v1/signup", async (c) => {
  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const { success } = signupInput.safeParse(body);

  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs not correct",
    });
  }

  const user = await prisma.user.create({
    data: {
      email: body.username,
      password: body.password,
    },
  });
  //@ts-ignore
  const token = await sign({ id: user.id }, c.env.JWT_SECRET);

  return c.json({
    jwt: token,
  });
});
app.post("/api/v1/signin", async (c) => {
  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = signinInput.safeParse(body);

  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs not correct",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: body.username,
      password: body.password,
    },
  });

  if (!user) {
    c.status(403);
    return c.json({
      error: "user not found",
    });
  }
  //@ts-ignore
  const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);

  return c.json({
    jwt,
  });
});
app.post("/api/v1/blog", async (c) => {
  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  //@ts-ignore
  const token = c.env.token;
  //@ts-ignore
  const userId = c.env.userId;
  const body = await c.req.json();
  const { success } = createPostInput.safeParse(body);

  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs not correct",
    });
  }

  await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: userId,
    },
  });

  return c.json({
    msg: "Blog posted successfully",
  });
});
app.put("/api/v1/blog", async (c) => {
  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = updatePostInput.safeParse(body);

  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs not correct",
    });
  }

  const blog = await prisma.post.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });

  return c.json({
    msg: `Blog for the id ${body.id} has been updated successfully`,
  });
});

app.get("/api/v1/blog/bulk", async (c) => {
  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blogs = await prisma.post.findMany();

  return c.json({
    blogs,
  });
});

app.get("/api/v1/blog/:id", async (c) => {
  const postId = c.req.param("id");
  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.post.findFirst({
      where: {
        id: Number(postId),
      },
    });

    return c.json({
      blog,
    });
  } catch (e) {
    c.status(411);
    return c.json({
      message: "Error while fetching the blog post",
    });
  }
});

export default app;
