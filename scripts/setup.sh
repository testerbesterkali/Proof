#!/bin/bash
echo "Setting up Proof Monorepo..."
npm install
cp .env.example .env
npm run db:generate
echo "Setup complete. Run 'docker-compose up' to start services."
