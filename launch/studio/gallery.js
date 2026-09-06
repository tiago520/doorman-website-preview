const films=[{id:'07-studio-groove',name:'Studio groove'},{id:'08-studio-club',name:'Club mix'}];
const story=[[0,'AI moves fast. Keep control.'],[4,'Meet Doorman. The AI gateway.'],[8,'Keep your tools. Bring supported AI traffic through one gateway.'],[14,'Route with intent. The task and your policy guide the model.'],[20,'Set the limits. Choose budgets and how they are enforced.'],[26,'Define the boundaries. Data rules. Agent permissions.'],[32,'See the spend. Follow recorded costs in one console.'],[38,'Your tools. Your keys. Your rules.'],[42,'Your AI. Under control. doorman.ai']];
let track=0,format='landscape',revision=0;
const video=document.querySelector('#player'),play=document.querySelector('#play-sound');
video.volume=.85;
function status(text){document.querySelector('#status').textContent=text;}
function select(nextTrack,nextFormat){
 const position=video.currentTime||0,resume=!video.paused&&!video.ended,version=++revision;
 video.pause();track=nextTrack;format=nextFormat;const f=films[track];
 document.querySelectorAll('[data-track]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.track)===track)));
 document.querySelectorAll('[data-format]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.format===format)));
 document.querySelector('#screen').classList.toggle('vertical',format==='vertical');
 document.querySelector('#video-download').href=`exports/${f.id}-${format}.mp4`;
 video.poster=`posters/${f.id}-${format}.jpg`;
 video.setAttribute('aria-label',`Doorman studio film, ${f.name}, ${format}`);
 const mp4=document.createElement('source');mp4.src=`exports/${f.id}-${format}.mp4`;mp4.type='video/mp4';
 const webm=document.createElement('source');webm.src=`previews/${f.id}-${format}.webm`;webm.type='video/webm';video.replaceChildren(mp4,webm);
 video.addEventListener('loadedmetadata',()=>{if(version!==revision)return;video.currentTime=Math.min(position,Math.max(0,video.duration-.1));},{once:true});
 video.load();
 if(resume)video.play().catch(()=>{play.hidden=false;status(`${f.name} ready. Press play to continue.`);});
 else play.hidden=position>.1;
 status(`${f.name}, ${format}.`);
}
play.addEventListener('click',()=>{video.muted=false;video.play().catch(()=>status('Please use the video controls to start playback.'));});
video.addEventListener('playing',()=>{play.hidden=true;});
video.addEventListener('ended',()=>{play.hidden=false;});
video.addEventListener('error',()=>status('The video could not load. The MP4 download is available below.'));
document.querySelectorAll('[data-track]').forEach(b=>b.addEventListener('click',()=>select(Number(b.dataset.track),format)));
document.querySelectorAll('[data-format]').forEach(b=>b.addEventListener('click',()=>select(track,b.dataset.format)));
document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});
const transcript=document.querySelector('#transcript');
story.forEach(([at,text])=>{const cue=document.createElement('div');cue.className='cue';const time=document.createElement('time');time.textContent=`${String(Math.floor(at/60)).padStart(2,'0')}:${String(at%60).padStart(2,'0')}`;const p=document.createElement('p');p.textContent=text;cue.append(time,p);transcript.append(cue);});
