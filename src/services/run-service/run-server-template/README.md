# First Run

[If there is not run into mongoDb]

1. Generate FILE EXECUTION TREE

- Generate tree (but only tree) / save it later in db as **The file execution tree** /

```
root: {<pathOfImport>}
children: {
  {<pathOfImport>}: [...children ]
}
```

2. Populate the EXECUTION TREE with preview data and file modified data BY creating a new STRUCTURE, creating a new MAP structure in which we save

```
{ <pathOfImport> } : {
  filePreview: '...'
  modifiedFile: '...'
}
```

3. Register the RUN into mongoDb **started runs**, store: clonedFiles, previews, mongoData

- Save the data in flat view in Mongo

```
{
  // file data in the tree
  {path of the import}: {
  ... fileClonedData, filePreviewData
  },

  // The file execution tree
  root: {path of import}
  children: {
    {path of import}: [...children ]
  }
}
```

**start generating files here - Generate a copies of the cloned files (play.ts) into project directory, based on the created structure... in [2]**

4. Start server with the cloned files (SHELL)

5. Collect data from the run script into MongoDb **run data**

6. Start watcher for file change ...

7. Return { clonedFiles, previews, mongoData }

[Else]

- Return run data from mongo db

[Client]

1. Connect to websocket for update of the data

# CASE WHEN FILE IS CHANGED

-> Generate the new EXECUTION tree
-> Check if file is present in the tree, (or it is the root file)...

[if not present]

- exit

[if present]

- update the whole EXECUTION TREE with the new one
- update file data for only this file into mongodb - the other data will be populated from the data in mongo db
- run start server to collect the new data
- push new data to websocket
