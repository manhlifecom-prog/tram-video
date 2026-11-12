import assert from 'node:assert/strict';
import {test} from 'node:test';
import {validateTranscript} from './plan';
test('rejects malformed and overlapping timelines before rendering',()=>{
  for (const input of [null, {duration:NaN,segments:[]}, {duration:3,segments:[{start:0,end:4,text:'a'}]},
    {duration:4,segments:[{start:0,end:2,text:'a'},{start:1,end:3,text:'b'}]}])
    assert.throws(()=>validateTranscript(input));
});
test('preserves Vietnamese text and allows pauses',()=>{
  const t=validateTranscript({duration:5,segments:[{start:0,end:2,text:'Ánh sáng thật.'},{start:3,end:5,text:'Giữ giọng gốc.'}]});
  assert.equal(t.segments[0].text,'Ánh sáng thật.');
  assert.equal(t.segments[1].start,3);
});
