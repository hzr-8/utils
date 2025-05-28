const parseJsonFileToJson = async (file: Blob) => {
  const content = await readFileAsText(file);
  return parseJsonCodeToJson(content);
};

function readFileAsText(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target!.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

function parseJsonCodeToJson(jsonCode: string) {
  return JSON.parse(jsonCode);
}

export { parseJsonFileToJson };
