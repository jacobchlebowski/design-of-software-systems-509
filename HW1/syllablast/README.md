### Author - jachlebowski@wpi.edu

## Run Syllablast

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

*If it fails to run, you may have to build it first:
```bash
npm run build
```

## Test Syllablast

Install code coverage if necessary, and then run the test

```bash
#install code coverage
npm install -D @vitest/coverage-v8
#run the test with:
npm run test
#or for code coverage, run:
npm run test -- --run --reporter verbose --coverage
```


#### Extra info
This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).