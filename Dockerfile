# Use pre-built output from host
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Copy pre-built app from host
COPY public ./public
COPY .next ./.next
COPY node_modules ./node_modules
COPY package.json ./package.json
COPY next.config.ts ./next.config.ts

EXPOSE 3000
CMD ["npx", "next", "start"]
