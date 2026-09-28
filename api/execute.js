export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Método não permitido"});
  const {approved}=req.body||{};
  if(!approved) return res.status(400).json({error:"Execução exige confirmação explícita."});
  return res.status(501).json({error:"Execução ainda não habilitada nesta versão.",next:"A camada de IA precisa devolver alterações estruturadas por arquivo; somente depois disso o backend criará uma branch e um Pull Request."});
}