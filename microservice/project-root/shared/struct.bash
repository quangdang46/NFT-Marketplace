#!/bin/bash

# Create all directories according to README.md structure
mkdir -p config \
  constants/auth constants/common \
  decorators \
  dto/auth dto/user \
  entities \
  events \
  exceptions \
  guards \
  helpers \
  interceptors \
  interfaces/auth interfaces/user \
  middlewares \
  pipes \
  services \
  utils

# Create placeholder files to maintain directory structure
touch config/.gitkeep
touch decorators/.gitkeep
touch dto/auth/.gitkeep
touch dto/user/.gitkeep
touch entities/.gitkeep
touch events/.gitkeep
touch exceptions/.gitkeep
touch guards/.gitkeep
touch helpers/.gitkeep
touch interceptors/.gitkeep
touch interfaces/auth/.gitkeep
touch interfaces/user/.gitkeep
touch middlewares/.gitkeep
touch pipes/.gitkeep
touch services/.gitkeep
touch utils/.gitkeep

echo "Directory structure created successfully!"