const text = `  /**
   * Visual variant of the component
   * @type {'primary' | 'success' | 'error'}
   * @default 'primary'
   */`;

console.log('Input text:');
console.log(text);
console.log('\n---\n');

const regex1 = /\/\*\*\s*([\s\S]*?)\*\*/;
const match1 = text.match(regex1);
console.log('Regex 1 result:', match1);
console.log('Match 1 [1]:', match1?.[1]);

const regex2 = /\/\*\*([\s\S]*?)\*\//;
const match2 = text.match(regex2);
console.log('Regex 2 result:', match2?.[1]);
