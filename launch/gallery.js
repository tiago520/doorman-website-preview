// Plain script keeps the exported gallery usable from a local file as well as HTTP.
const collection=[
  {id:'01-the-switch',title:'The Switch',seconds:38.4,bpm:100,description:'A spacious, cinematic brand reveal. Warm keys, deep bass and a rising electronic pulse.',story:[['Your AI is everywhere.','Tools. Agents. Models.'],['Bring it into focus.','Meet Doorman, your AI gateway.'],['One gateway.','Between your tools and your models.'],['Route with clear rules.','Match the model to the task and your policy.'],['Give AI clear boundaries.','Budgets. Data rules. Agent permissions.'],['See where the money goes.','Understand recorded spend by team, tool and model.'],['Keep your tools. Keep building.','Your providers. Your keys. Your rules.'],['Your AI. Under control.','Explore Doorman at doorman.ai.']]},
  {id:'02-in-motion',title:'In Motion',seconds:32,bpm:120,description:'A bold, rhythmic launch cut. Oversized type, sharp edits and an energetic electronic groove.',story:[['More tools. More agents. More AI.','Who’s in control?'],['Take control.','Meet Doorman.'],['The AI gateway.','Your tools → Doorman → Your models.'],['Route smarter.','A suitable model, guided by your rules.'],['Set the boundaries.','Budgets. Data rules. Agent permissions.'],['Make spend visible.','Understand the cost of your AI.'],['Your tools. Your keys. Your rules.','Keep building.'],['Your AI. Under control.','Explore Doorman at doorman.ai.']]},
  {id:'03-inside-doorman',title:'Inside Doorman',seconds:40,bpm:96,description:'A precise product story. Follow a request from your tools to the evidence, with a crisp downtempo score.',story:[['What happens to an AI request?','Follow the request.'],['Meet your AI gateway.','Doorman connects the tools you use to the models you choose.'],['Start with your tools.','Connect a supported client through Doorman.'],['Match the model to the task.','Routing considers the request and your policy.'],['Put your rules in the flow.','Define budgets, data rules and agent permissions.'],['Follow the request.','Inspect the model, recorded cost and outcome.'],['Know what you spend.','Explore recorded costs by team, tool and model.'],['Your AI. Under control.','Explore Doorman at doorman.ai.']]}
];
let selected=1,format='landscape';
const player=document.querySelector('#player');
function update(load=true){
  const f=collection[selected];
  document.querySelector('#film-title').textContent=`0${selected+1} / ${f.title}`;
  document.querySelector('#film-meta').textContent=`${f.seconds} sec · ${f.bpm} BPM`;
  document.querySelector('#film-description').textContent=f.description;
  document.querySelector('#screen').classList.toggle('vertical',format==='vertical');
  document.querySelector('#video-download').href=`exports/${f.id}-${format}.mp4`;
  document.querySelector('#music-download').href=`audio/${f.id}.m4a`;
  document.querySelector('#srt-download').href=`exports/${f.id}.srt`;
  document.querySelectorAll('[data-film]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.film)===selected)));
  document.querySelectorAll('[data-format]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.format===format)));
  const transcript=document.querySelector('#transcript');transcript.replaceChildren();
  f.story.forEach(([title,body],i)=>{const cue=document.createElement('div');cue.className='cue';const time=document.createElement('time');time.textContent=`${(i*f.seconds/8).toFixed(1)}s`;const copy=document.createElement('div');const b=document.createElement('b');b.textContent=title;const p=document.createElement('p');p.textContent=body;copy.append(b,p);cue.append(time,copy);transcript.append(cue);});
  if(load){player.pause();player.poster=`posters/${f.id}-${format}.jpg`;const mp4=document.createElement('source');mp4.src=`exports/${f.id}-${format}.mp4`;mp4.type='video/mp4';const webm=document.createElement('source');webm.src=`previews/${f.id}-${format}.webm`;webm.type='video/webm';player.replaceChildren(mp4,webm);player.setAttribute('aria-label',`Doorman — ${f.title}, ${format}`);player.load();}
  document.querySelector('#selection-status').textContent=`${f.title}, ${format}, ${f.seconds} seconds. Ready to play.`;
}
document.querySelectorAll('[data-film]').forEach(button=>button.addEventListener('click',()=>{selected=Number(button.dataset.film);update();}));
document.querySelectorAll('[data-format]').forEach(button=>button.addEventListener('click',()=>{format=button.dataset.format;update();}));
document.addEventListener('visibilitychange',()=>{if(document.hidden)player.pause();});
update(false);
