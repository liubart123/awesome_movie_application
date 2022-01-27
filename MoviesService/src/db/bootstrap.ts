import 'reflect-metadata';
import { createConnection } from 'typeorm';
import connecionConfig from './ormconfig';

const start = async () => {
  const connection = await createConnection({
    ...connecionConfig,
  });
};

export default start;
