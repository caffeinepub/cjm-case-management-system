# Deployment Verification

## Live Site URL

After deployment, the live site URL can be obtained in the following ways:

1. **From the browser**: Simply copy the URL from your browser's address bar when viewing the deployed application.

2. **Using the "Copy Live Link" button**: Click the "Copy Live Link" button in the dashboard header to copy the current site URL to your clipboard.

3. **From deployment logs**: The deployment process will output the final canister URL in the format:
   ```
   https://<canister-id>.ic0.app
   ```

## Sharing the Link

Once you have the live URL, you can:
- Share it with team members
- Bookmark it for quick access
- Use it to test QR code scanning across devices
- Embed it in documentation or training materials

## Testing QR Code Features

To verify the QR code generation and scanning features:

1. Open the live site on one device
2. Fill in the form fields (Name, Case Number, Crime Number, Forward Date)
3. Click "Generate QR Code" to create a scannable code
4. Open the same live site on another device (or use the same device)
5. Click "Start Scanner" and scan the generated QR code
6. Verify that all fields are auto-filled correctly
7. Make any necessary edits to the auto-filled data
8. Click "Add Record" to save

The QR code encodes data in the format: `Name|CaseNo|CrimeNo|Date`
