# Live Projects Apps Script

This folder contains the Google Apps Script files for exposing your Google Sheet as a JSON or CSV endpoint for the Live Products page.

## Files

- `Code.gs`
  The web app endpoint that reads a sheet tab and returns JSON or CSV.
- `appsscript.json`
  Basic Apps Script project manifest.

## Expected Sheet Headers

Use this exact first-row structure in your Google Sheet:

```text
Pre Title
Title
Description
First Data Point Title
First Data Point Text
Second Data Point Title
Second Data Point Text
CTA 1 Text
CTA 1 Link
CTA 2 Text
CTA 2 Link
CTA 3 Text
CTA 3 Link
Project Image Link
Lock
Password
```

## Deploy Steps

1. Open your Google Sheet.
2. Go to `Extensions` -> `Apps Script`.
3. Paste the contents of `Code.gs`.
4. Replace the manifest with `appsscript.json` if needed.
5. Click `Deploy` -> `New deployment`.
6. Choose `Web app`.
7. Set `Execute as` to `Me`.
8. Set `Who has access` to `Anyone`.
9. Deploy and copy the web app URL.

## Example Endpoints

JSON:

```text
https://script.google.com/macros/s/DEPLOYMENT_ID/exec?sheet=Live%20Products
```

CSV:

```text
https://script.google.com/macros/s/DEPLOYMENT_ID/exec?sheet=Live%20Products&format=csv
```

## Response Shape

The JSON response looks like this:

```json
{
  "success": true,
  "sheet": "Live Products",
  "count": 8,
  "rows": [
    {
      "pre_title": "B2C SaaS Platform",
      "title": "Paperpal AI Writing Platform",
      "description": "Lead designer for an AI suite serving 4M+ academics.",
      "first_data_point_title": "4M+",
      "first_data_point_text": "Users Worldwide"
    }
  ]
}
```
