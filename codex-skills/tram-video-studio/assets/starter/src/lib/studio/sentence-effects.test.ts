import assert from 'node:assert/strict';
import {test} from 'node:test';
import {sentenceEffectsRequested,sentenceMetaphor,sentenceEffectsPlan} from './sentence-effects';
import {motionProps} from './motion-props';
import {defaultConcept} from './types';
test('latest explicit instruction can enable or disable sentence illustrations without unrelated feedback resetting it',()=>{
 assert(sentenceEffectsRequested('Minh họa từng câu.'));
 assert(sentenceEffectsRequested('Giữ giọng gốc',[{text:'Thêm hiệu ứng mô tả cho mỗi câu',at:'',version:1},{text:'Nâng tiếng lên',at:'',version:2}]));
 assert(!sentenceEffectsRequested('Minh họa từng câu',[{text:'Không cần từng câu, ít hiệu ứng hơn',at:'',version:1}]));
 assert(!sentenceEffectsRequested('Cắt từng câu cho gọn'));
});
test('meaning changes the object and unachieved numbers are never presented as a daily goal',()=>{
 assert.equal(sentenceMetaphor('Đôi khi mình gặp những khó khăn').kind,'obstacle');
 assert.equal(sentenceMetaphor('Không mất nhiều thời gian quay').kind,'time');
 assert.equal(sentenceMetaphor('Ra ngoài cửa, ánh sáng đẹp hơn').kind,'window');
 assert.equal(sentenceMetaphor('một ngày ra được hai video là thành công').number,'2');
 assert.notEqual(sentenceMetaphor('Tôi chưa làm được hai video mỗi ngày').kind,'goal');
 assert.notEqual(sentenceMetaphor('Mỗi ngày hai mươi video').kind,'goal');
 assert.notEqual(sentenceMetaphor('Tôi đã xem hai video').kind,'goal');
});
test('workspace concept enables illustrations for a new clip while explicit clip feedback takes priority',()=>{
 const concept='Minh họa chuyển động theo nghĩa từng câu. Giữ giọng gốc.';
 assert(sentenceEffectsRequested('',[],concept));
 assert(sentenceEffectsRequested('Dựng clip này, phụ đề rõ',[],concept));
 assert(!sentenceEffectsRequested('Không cần minh họa từng câu',[],concept));
 assert(!sentenceEffectsRequested('',[{text:'Bỏ hiệu ứng từng câu',at:'',version:1}],concept));
 assert(sentenceEffectsRequested('Không cần minh họa từng câu',[{text:'Thêm minh họa từng câu',at:'',version:2}],concept));
 assert(!sentenceEffectsRequested('Giữ giọng gốc',[],'Chỉ dùng footage và phụ đề.'));
});
test('every speech interval receives an effect without trimming audio or changing caption text',()=>{
 const speech=[{start:1,end:3,text:'Gặp khó khăn.'},{start:4,end:6,text:'Không mất nhiều thời gian quay.'},{start:7,end:9,text:'Giờ có mỗi cái điện thoại.'}];
 const p=sentenceEffectsPlan(speech,10,'Video');
 assert.deepEqual(p.scenes.map(s=>[s.start,s.end]),[[0,4],[4,7],[7,10]]);
 assert.deepEqual(p.scenes.map(s=>s.items?.[1]),['obstacle','time','phone']);
 const props=motionProps(p,speech,defaultConcept,1080,1920);
 assert.equal(props.durationInFrames,300);
 assert.equal(props.captions.map(c=>c.text).join(' '),speech.map(s=>s.text).join(' '));
 assert.throws(()=>sentenceEffectsPlan(Array.from({length:81},(_,i)=>({start:i,end:i+1,text:'a'})),81,'Video'));
});
test('adding illustrations preserves source cuts and never restores discarded material',()=>{
 const speech=[{start:0,end:3,text:'Gặp khó khăn.'},{start:4,end:6,text:'Không mất nhiều thời gian quay.'},{start:7,end:10,text:'Giờ có mỗi cái điện thoại.'}];
 const cuts={title:'',summary:'',scenes:[{start:1,end:4.05,caption:'',visual:''},{start:6,end:8.1,caption:'',visual:''}]};
 const p=sentenceEffectsPlan(speech,10,'Video',cuts);
 assert.deepEqual(p.scenes.map(s=>[s.start,s.end]),[[1,4.05],[6,7],[7,8.1]]);
 assert(Math.abs(p.scenes.reduce((n,s)=>n+s.end-s.start,0)-5.15)<1e-9);
 assert(p.scenes.every(s=>s.end<=4.05||s.start>=6));
});
