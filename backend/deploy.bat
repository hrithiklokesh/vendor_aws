@echo off
echo Cleaning previous deployment...
IF EXIST deployment rmdir /S /Q deployment
echo Creating deployment folder...
mkdir deployment
echo Copying files...
xcopy app.js deployment\ /Y
xcopy lambda.js deployment\ /Y
xcopy websocketHandler.js deployment\ /Y
xcopy serverless.yml deployment\ /Y

echo Creating clean .env file without AWS credentials...
echo MONGO_URI=mongodb+srv://dhanush:Dhanush123@caasdiglobal.yahxc.mongodb.net/?retryWrites=true^&w=majority^&appName=CaasdiGlobal > deployment\.env
echo PORT=5001 >> deployment\.env
echo SESSION_SECRET=517f384b904d4e8a04abfc2ed2cad1422c59b472241bc6fa06908f5dfe93b2e2 >> deployment\.env
echo GOOGLE_CLIENT_ID=540364621159-6anfmspca2foov8tif1gvak3vqg089v3.apps.googleusercontent.com >> deployment\.env
echo GOOGLE_CLIENT_SECRET=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 >> deployment\.env
echo S3_BUCKET_NAME=mac-vendor-uploads >> deployment\.env

xcopy /E /I config deployment\config
xcopy /E /I routes deployment\routes
xcopy /E /I models deployment\models
xcopy /E /I controllers deployment\controllers
xcopy /E /I utils deployment\utils
xcopy /E /I auth deployment\auth
xcopy /E /I websocket deployment\websocket

echo Creating minimal package.json...
node serverless-package.js
copy deployment-package.json deployment\package.json

echo Installing dependencies in deployment folder...
cd deployment
REM Install only production dependencies with REDUCED concurrency
call npm install --production --no-package-lock --no-audit --no-fund --legacy-peer-deps

echo Installing Serverless plugins...
call npm install serverless-offline@12.0.4 serverless-dotenv-plugin@4.0.2 serverless-prune-plugin --save-dev --no-package-lock --legacy-peer-deps

echo Deploying with Serverless...
call serverless deploy --stage dev --verbose

echo Deployment process completed
cd .. 