const parquet = require('parquetjs-lite');

async function readParquet() {
  const reader = await parquet.ParquetReader.openFile('./logos.snappy.parquet');
  
  const cursor = reader.getCursor();
  let record = null;
  
  while (record = await cursor.next()) {
    console.log(record);
  }

  await reader.close();
}

readParquet();
