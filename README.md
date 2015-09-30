# Quick / Dirty Google Drive CMS

Mock-Up for dynamic content driven by spreadsheets/docs

### Overview

* Version 0.0.0

### To run

* Install Node
* `npm install -g gulp`
# `npm start`

### Notes:

# Requires several API keys. These must be placed in a folder called '.keys' in the repo
* One Google service account key from https://console.developers.google.com. Rename to google.json
* One Stormpath API key from https://api.stormpath.com/ui2/index.html#/. Rename to stormpath.properties
* Consider using webhooks to watch the folder for changes - loading all of the data on startup.
    * This would keep an up-to-date copy of all data in memory (or in some file) on the server: 
    * https://developers.google.com/drive/v2/reference/files/watch

    <a title="By Fev (Own work) [Public domain], via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File%3ACalina_en_el_este_de_Caracas.jpg"><img width="512" alt="Calina en el este de Caracas" src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Calina_en_el_este_de_Caracas.jpg/512px-Calina_en_el_este_de_Caracas.jpg"/></a>