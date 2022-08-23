import Fastify from 'fastify';

import { users } from './users';

const fastify = Fastify({
  logger: true
});
fastify.register(import('@fastify/cors'));
fastify.register(import('@fastify/multipart'), {
  addToBody: true
});
fastify.register(import('@fastify/cookie'));

fastify.post('/uppercase', (request, reply) => {
  const body = request.body;
  if (body.toLowerCase().includes('fuck')) {
    return reply.status(403).send('unresolved');
  } else {
    return reply.send(body.toUpperCase());
  }
});

fastify.post('/lowercase', (request, reply) => {
  const body = request.body.toLowerCase();
  if (body.includes('fuck')) {
    return reply.status(403).send('unresolved');
  } else {
    return reply.send(body);
  }
});

fastify.get('/user/:id', (request, reply) => {
  const { id } = request.params;
  const user = users[id];
  if (!user) {
    return reply.status(400).send('User not exist');
  }
  return reply.send(users[id]);
});

fastify.get('/users', (request, reply) => {
  const { filter, value } = request.query;
  const usersArray = Object.values(users);
  if (!filter && !value) {
    return reply.send(usersArray);
  }
  let valueMod;
  (!isNaN(+value)) ? valueMod = +value : valueMod = value;
  const filtered = usersArray.filter(user => {
    return user[filter] === valueMod;
  });
  return reply.send(filtered);
});

export default fastify;
