import { describe, expect, test, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../app';
import { User } from '../models/User';
import { Post } from '../models/Post';

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
  describe('POST /api/posts', () => {
    test('should create a new post when authenticated', async () => {
      const postData = {
        content: 'Test post content'
      };

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(postData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.content).toBe(postData.content);
      expect(response.body.data.user.id).toBe(userId);
    });

    test('should fail to create post when not authenticated', async () => {
      const response = await request(app)
        .post('/api/posts')
        .send({ content: 'Test post content' });

      expect(response.status).toBe(401);
    });

    test('should fail to create post with invalid data', async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: '' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/posts', () => {
    beforeEach(async () => {
      // Create some test posts
      await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Test post 1' });

      await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Test post 2' });
    });

    test('should get posts when authenticated', async () => {
      const response = await request(app)
        .get('/api/posts')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.posts)).toBe(true);
      expect(response.body.data.posts.length).toBe(2);
    });

    test('should fail to get posts when not authenticated', async () => {
      const response = await request(app)
        .get('/api/posts');

      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/posts/:id', () => {
    let postId: string;

    beforeEach(async () => {
      // Create a test post
      const createResponse = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Original content' });

      postId = createResponse.body.data.id;
    });

    test('should update post when authenticated and authorized', async () => {
      const response = await request(app)
        .patch(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Updated content' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.content).toBe('Updated content');
    });

    test('should fail to update non-existent post', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .patch(`/api/posts/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Updated content' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/posts/:id', () => {
    let postId: string;

    beforeEach(async () => {
      // Create a test post
      const createResponse = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Test post' });

      postId = createResponse.body.data.id;
    });

    test('should delete post when authenticated and authorized', async () => {
      const response = await request(app)
        .delete(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify post is deleted
      const getResponse = await request(app)
        .get(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(getResponse.status).toBe(404);
    });

    test('should fail to delete non-existent post', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/posts/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/posts/:id/like', () => {
    let postId: string;

    beforeEach(async () => {
      // Create a test post
      const createResponse = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Test post' });

      postId = createResponse.body.data.id;
    });

    test('should toggle like status when authenticated', async () => {
      // Like the post
      const likeResponse = await request(app)
        .post(`/api/posts/${postId}/like`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(likeResponse.status).toBe(200);
      expect(likeResponse.body.success).toBe(true);
      expect(likeResponse.body.data.likes).toContain(userId);

      // Unlike the post
      const unlikeResponse = await request(app)
        .post(`/api/posts/${postId}/like`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(unlikeResponse.status).toBe(200);
      expect(unlikeResponse.body.success).toBe(true);
      expect(unlikeResponse.body.data.likes).not.toContain(userId);
    });

    test('should fail to like non-existent post', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .post(`/api/posts/${fakeId}/like`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });
});
