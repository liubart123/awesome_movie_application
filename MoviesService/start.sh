#!/bin/bash
ls -la
npm run typeorm migration:run
npm run test
npm run start