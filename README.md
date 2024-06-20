### Prediction
- Method

  POST

- URL

  /predict

- Body Request
  ```form-data
  Key = file File
  
  Value = Select Files (.jpg/.jpeg file extension)
  ```

- Response
  ```json
  {
      "status": "success",
      "message": "Model is predicted successfully.",
      "data": {
         "id": {data_id as random string},
         "result": {label as string},
         "suggestion": "Silakan upload ulang untuk menerjemahkan bahasa isyarat lainnya",
         "confidenceScore": 100 (number),
         "createdAt": "2024-06-20T23:27:46.433Z",
      }
  }
  ```
