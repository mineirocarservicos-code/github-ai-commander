const $=id=>document.getElementById(id);
let mediaRecorder=null,chunks=[],startedAt=0,timerInterval=null,lastAnalysis=null;

function setPreview(text,title="Análise do comando"){
  $("previewTitle").textContent=title;
  $("previewText").textContent=text;
  $("preview").classList.remove("hidden");
  $("preview").scrollIntoView({behavior:"smooth",block:"center"});
}

$("analyze").onclick=async()=>{
  const command=$("command").value.trim();
  if(!command){$("command").focus();return}
  $("analyze").disabled=true;$("analyze").textContent="Analisando…";
  const repository=$("repo").value,branch=$("branch").value;
  try{
    const response=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({repository,branch,command})});
    const data=await response.json();
    if(!response.ok) throw new Error(data.error||"Falha na análise");
    lastAnalysis=data;
    $("previewTitle").textContent="Comando analisado";
    $("previewText").textContent=data.summary;
    const fileBox=document.querySelector(".file");
    fileBox.innerHTML="📄 <span>"+(data.files?.length||0)+" arquivos encontrados</span><small>revisar antes de executar</small>";
    $("preview").classList.remove("hidden");
    $("preview").scrollIntoView({behavior:"smooth",block:"center"});
  }catch(error){
    setPreview("O backend ainda não está publicado/configurado. A interface está pronta; publique o projeto e configure GITHUB_TOKEN para ativar a leitura real do repositório.","Modo de preparação");
  }finally{$("analyze").disabled=false;$("analyze").textContent="Analisar comando"}
};

$("cancel").onclick=()=>{$("preview").classList.add("hidden");lastAnalysis=null};

$("execute").onclick=async()=>{
  if(!lastAnalysis){alert("Faça a análise do comando primeiro.");return}
  try{
    const response=await fetch("/api/execute",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...lastAnalysis,approved:true})});
    const data=await response.json();
    alert(data.error||"Execução concluída.");
  }catch(e){alert("Backend indisponível. Nenhuma alteração foi feita.");}
};

if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js"));

$("mic").onclick=async()=>{
  if(mediaRecorder?.state==="recording"){mediaRecorder.stop();return}
  if(!navigator.mediaDevices?.getUserMedia){alert("Seu navegador não permite gravação de áudio.");return}
  try{
    const stream=await navigator.mediaDevices.getUserMedia({audio:true});
    chunks=[];mediaRecorder=new MediaRecorder(stream);startedAt=Date.now();
    $("recording").classList.remove("hidden");
    timerInterval=setInterval(()=>{const s=Math.floor((Date.now()-startedAt)/1000);$("timer").textContent=String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")},250);
    mediaRecorder.ondataavailable=e=>chunks.push(e.data);
    mediaRecorder.onstop=()=>{
      clearInterval(timerInterval);stream.getTracks().forEach(t=>t.stop());$("recording").classList.add("hidden");
      $("command").value="Comando de voz gravado. A transcrição será conectada à camada de IA.";
      $("command").focus();
    };
    mediaRecorder.start();
  }catch(e){alert("Permissão de microfone não concedida.")}
};