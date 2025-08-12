# Division Orderly Backend

A FastAPI-based backend service for processing division order PDFs with AI-powered data extraction and signature management.

## 🚀 Features

- **PDF Processing**: Extract text from division order PDFs using OCR
- **AI Integration**: Claude AI for intelligent data extraction and parsing
- **Signature Management**: Add digital signatures to PDFs with precise positioning
- **Batch Processing**: Handle multiple files simultaneously
- **Production Ready**: Configured for Railway deployment

## 🛠️ Tech Stack

- **FastAPI**: Modern Python web framework
- **PyMuPDF**: PDF processing and manipulation
- **Tesseract OCR**: Text extraction from images
- **Anthropic Claude**: AI-powered data extraction
- **Railway**: Production deployment platform

## 📁 Project Structure

```
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── railway.json           # Railway deployment configuration
├── .env.production.example # Production environment variables template
├── pdf_storage/           # PDF file storage
├── debug/                 # Debug logs and outputs
├── entities/              # Entity data storage
└── poppler/              # Poppler PDF utilities
```

## 🚀 Quick Start

### Local Development

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set environment variables**:
   ```bash
   cp .env.production.example .env
   # Edit .env with your actual values
   ```

3. **Run the server**:
   ```bash
   uvicorn main:app --reload
   ```

### Production Deployment

This backend is configured for **Railway deployment**:

1. **Connect to Railway**: The `railway.json` file contains the deployment configuration
2. **Environment Variables**: Set production environment variables in Railway dashboard
3. **Automatic Deployment**: Railway will automatically deploy on git push

## 🔧 API Endpoints

- `POST /api/upload-multiple`: Upload and process multiple division orders
- `POST /api/sign-pdf`: Add signatures to PDFs
- `GET /`: Health check endpoint

## 🌍 Environment Variables

Required for production:

```bash
ENVIRONMENT=production
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
FRONTEND_URL=https://your-frontend-domain.vercel.app
ANTHROPIC_API_KEY=your_claude_api_key
DATABASE_URL=postgresql://username:password@host:port/database
```

## 📊 Deployment Status

- **Frontend**: ✅ Deployed on Vercel
- **Backend**: 🚀 Ready for Railway deployment
- **Database**: 🔧 Configured for production

## 🔗 Frontend Integration

This backend is designed to work with the Division Orderly frontend deployed on Vercel. The frontend will automatically connect to this backend once deployed.

## 📝 License

This project is part of the Division Orderly application suite. 