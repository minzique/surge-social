import { describe, expect, test, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../app';
import { User } from '../models/User';
import { Post, IPostDocument } from '../models/Post';

let mongoServer: MongoMemoryServer;
let authToken: string;
let userId: string;

beforeAll(async () => {
  // Setup in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear database before each test
  await User.deleteMany({});
  await Post.deleteMany({});

  // Create a test user and get auth token
  const testUser = {
    email: 'test@example.com',
    username: 'testuser',
    password: 'Test123!@#'
  };

  const registerResponse = await request(app)
    .post('/api/auth/register')
    .send(testUser);

  authToken = registerResponse.body.token;
  userId = registerResponse.body.user.id;
});

describe('Post Routes', () => {
  describe('GET /api/posts/:id', () => {
    let postId: string;

    beforeEach(async () => {
      // Create a test post directly in the database
      const post = await Post.create({
        content: 'Test post content',
        user: userId,
        likes: []
      });
      postId = post.id;
    });

    test('should get post by ID when authenticated', async () => {
      const response = await request(app)
        .get(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(postId);
      expect(response.body.data.content).toBe('Test post content');
    });

    test('should fail to get post when not authenticated', async () => {
      const response = await request(app)
        .get(`/api/posts/${postId}`);

      expect(response.status).toBe(401);
    });

    test('should return 404 for non-existent post', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/posts/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/posts/user/:id', () => {
    beforeEach(async () => {
      // Create test posts directly in the database
      await Post.create([
        {
          content: 'Test post 1',
          user: userId,
          likes: []
        },
        {
          content: 'Test post 2',
          user: userId,
          likes: []
        }
      ]);
    });

    test('should get user posts when authenticated', async () => {
      const response = await request(app)
        .get(`/api/posts/user/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.posts)).toBe(true);
      expect(response.body.data.posts.length).toBe(2);
    });

    test('should fail to get user posts when not authenticated', async () => {
      const response = await request(app)
        .get(`/api/posts/user/${userId}`);

      expect(response.status).toBe(401);
    });

    test('should return empty array for user with no posts', async () => {
      const newUserId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/posts/user/${newUserId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.posts)).toBe(true);
      expect(response.body.data.posts.length).toBe(0);
    });
  });
});
