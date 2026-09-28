export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Método não permitido"});
  const {repository,branch,command}=req.body||{};
  if(!repository||!branch||!command) return res.status(400).json({error:"repository, branch e command são obrigatórios"});
  if(!process.env.GITHUB_TOKEN) return res.status(503).json({error:"Backend não configurado: GITHUB_TOKEN ausente."});
  try{
    const gh=await fetch("https://api.github.com/repos/"+repository+"/git/trees/"+encodeURIComponent(branch)+"?recursive=1",{headers:{Authorization:"Bearer "+process.env.GITHUB_TOKEN,Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"}});
    if(!gh.ok) throw new Error("Não foi possível ler o repositório.");
    const tree=await gh.json();
    const files=(tree.tree||[]).filter(x=>x.type==="blob").map(x=>x.path).slice(0,250);
    return res.status(200).json({mode:"scaffold",repository,branch,command,summary:"Arquivos do repositório carregados. A próxima camada de IA deve selecionar os arquivos relevantes e gerar o patch.",files,requiresConfirmation:true});
  }catch(e){return res.status(500).json({error:e.message||"Erro ao analisar repositório."});}
}