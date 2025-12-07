"""
Google Drive Integration Service
Handles OAuth flow and file uploads to Google Drive
"""

import os
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from googleapiclient.http import MediaInMemoryUpload
from typing import Dict, Any

class GoogleDriveService:
    def __init__(self):
        self.client_id = os.getenv("GOOGLE_OAUTH_CLIENT_ID")
        self.client_secret = os.getenv("GOOGLE_OAUTH_CLIENT_SECRET")
        self.redirect_uri = os.getenv("GOOGLE_OAUTH_REDIRECT_URI", "http://localhost:3000/dashboard/integrations/google-callback")
        
        self.scopes = [
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    
    def get_authorization_url(self, state: str) -> str:
        """
        Generate Google OAuth authorization URL
        
        Args:
            state: State parameter for CSRF protection (should be org_id)
        
        Returns:
            Authorization URL
        """
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [self.redirect_uri],
                }
            },
            scopes=self.scopes,
            state=state
        )
        
        flow.redirect_uri = self.redirect_uri
        
        authorization_url, _ = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true',
            prompt='consent'
        )
        
        return authorization_url
    
    def exchange_code_for_tokens(self, code: str) -> Dict[str, Any]:
        """
        Exchange authorization code for access and refresh tokens
        
        Args:
            code: Authorization code from Google
        
        Returns:
            Dict containing tokens and user info
        """
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [self.redirect_uri],
                }
            },
            scopes=self.scopes
        )
        
        flow.redirect_uri = self.redirect_uri
        flow.fetch_token(code=code)
        
        credentials = flow.credentials
        
        # Get user email
        user_info_service = build('oauth2', 'v2', credentials=credentials)
        user_info = user_info_service.userinfo().get().execute()
        
        return {
            "access_token": credentials.token,
            "refresh_token": credentials.refresh_token,
            "token_expiry": credentials.expiry.isoformat() if credentials.expiry else None,
            "email": user_info.get("email"),
        }
    
    def upload_file(
        self,
        file_content: bytes,
        file_name: str,
        mime_type: str,
        access_token: str,
        refresh_token: str = None,
        folder_name: str = "Ravono Reports"
    ) -> Dict[str, Any]:
        """
        Upload file to Google Drive
        
        Args:
            file_content: File content as bytes
            file_name: Name for the file
            mime_type: MIME type (e.g., 'application/pdf')
            access_token: Google access token
            refresh_token: Google refresh token (optional)
            folder_name: Folder name to create/use
        
        Returns:
            Dict with file_id and webViewLink
        """
        # Create credentials
        credentials = Credentials(
            token=access_token,
            refresh_token=refresh_token,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=self.client_id,
            client_secret=self.client_secret
        )
        
        # Build Drive service
        service = build('drive', 'v3', credentials=credentials)
        
        # Find or create folder
        folder_id = self._get_or_create_folder(service, folder_name)
        
        # Upload file
        file_metadata = {
            'name': file_name,
            'parents': [folder_id]
        }
        
        media = MediaInMemoryUpload(file_content, mimetype=mime_type, resumable=True)
        
        file = service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id, name, webViewLink'
        ).execute()
        
        return {
            "file_id": file.get("id"),
            "file_name": file.get("name"),
            "web_view_link": file.get("webViewLink"),
        }
    
    def _get_or_create_folder(self, service, folder_name: str) -> str:
        """Get existing folder or create new one"""
        # Search for existing folder
        results = service.files().list(
            q=f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder' and trashed=false",
            spaces='drive',
            fields='files(id, name)'
        ).execute()
        
        folders = results.get('files', [])
        
        if folders:
            return folders[0]['id']
        
        # Create new folder
        file_metadata = {
            'name': folder_name,
            'mimeType': 'application/vnd.google-apps.folder'
        }
        
        folder = service.files().create(
            body=file_metadata,
            fields='id'
        ).execute()
        
        return folder.get('id')
