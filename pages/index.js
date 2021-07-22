import React from "react";
import MainGrid from "../src/components/MainGrid";
import Box from "../src/components/Box";
import {AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet} from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";
import { BoxImageLabel } from "../src/components/BoxImageLabel";

function ProfilePhoto(propriedades) {
  console.log(propriedades);
  return (
      <Box as='aside'>
        <img src={`https://github.com/${propriedades.gitHubUser.login}.png`} style={{borderRadius:'8px'}}/>
        <hr/>
        
        <p>
          <a className="boxLink" href={`http://github.com/${propriedades.gitHubUser.login}`}> 
            @{propriedades.gitHubUser.login}
          </a>
        </p>
        <hr/>

        <AlurakutProfileSidebarMenuDefault/>

      </Box>
  )
}

export default function Home() {

  const [comunidades, setComunidades] = React.useState([
    {
      id: new Date().toISOString().concat(parseInt(Math.random(0,1)*10000)),
      descricao:"Eu odeio acordar cedo", 
      image:"https://alurakut.vercel.app/capa-comunidade-01.jpg"
    }]);

  const gitHubUser = {
    login: 'juhnaorodrigues'
  };

  const pessoasFavoritas = [
    {
      id: new Date().toISOString().concat(parseInt(Math.random(0,1)*10000)),
      descricao:"peas", 
      image:"https://github.com/peas.png"
    },
    {
      id: new Date().toISOString().concat(parseInt(Math.random(0,1)*10000)),
      descricao:"peas", 
      image:"https://github.com/omariosouto.png"
    },
    {
      id: new Date().toISOString().concat(parseInt(Math.random(0,1)*10000)),
      descricao:"peas", 
      image:"https://github.com/rafaballerini.png"
    },
    {
      id: new Date().toISOString().concat(parseInt(Math.random(0,1)*10000)),
      descricao:"peas", 
      image:"https://github.com/juunegreiros.png"
    }
  ];

  const propriedadesPessoas = {
    descricao: "Pessoas da comunidade",
    lista:pessoasFavoritas
  }

  const propriedadesComunidades = {
    descricao: "Comunidades",
    lista:comunidades
  }

  const [pessoasGitHub, setPessoasGitHub] = React.useState([]);
  
  React.useEffect( () =>{
    fetch('https://api.github.com/users/peas/followers?page=1&per_page=6')
    .then((respostaServer) => {
        return respostaServer.json();
    }).then((respostaJSON) => {
        console.log(respostaJSON);
        setPessoasGitHub(respostaJSON);
    });

    fetch('https://graphql.datocms.com/',{ 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': '6c5cad95c69391f12f0b6151b85fe7'
      },
      body: JSON.stringify({
        query: `{ allCommunities {  
          id
          title
          createdAt
          communityUrl
          imageUrl
          creatorSlug    
          _firstPublishedAt } }`
      })
    })
    .then(async (respostaServer) => {
        let comunidadesDatoCms = await respostaServer.json();
        console.log('teste', comunidadesDatoCms);
        setComunidades(comunidadesDatoCms.data.allCommunities.map((item) => {
          return {
            id: item.id,
            descricao: item.title,
            image: item.imageUrl
          }
        }));
      })
  },[]);
 

  return (
    <>
      <AlurakutMenu githubUser={gitHubUser.login}/>
      <MainGrid>
        <div className="profileArea" style={{gridArea:'profileArea'}}>
          <ProfilePhoto gitHubUser={gitHubUser}/>
        </div>
        
        <div className="welcomeArea" style={{gridArea:'welcomeArea'}}>
          <Box>
            <h1 className="title">Bem-vindo(a)</h1>

            <OrkutNostalgicIconSet/>
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            
            <form onSubmit={(e)=> {
              console.log(e);
              e.preventDefault();
              let formData = new FormData(e.target);
              let title = formData.get('title');
              let image = formData.get('image');
              
              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                  title:title, 
                  imageUrl:image, 
                  creatorSlug: gitHubUser.login,
                  communityUrl: ''
                })
              }).then(async(itemCriado) => {
                const dados = await itemCriado.json();
                const comunidadeCriada = dados.registroCriado;
                
                console.log('comunidade criada: ', comunidadeCriada);

                setComunidades([...comunidades, {
                  id:comunidadeCriada.id,
                  descricao:comunidadeCriada.title, 
                  image:comunidadeCriada.imageUrl
                }]);

              })
              console.log(comunidades);
              console.log(pessoasFavoritas);
            }}>
              
              <div>
                <input 
                  placeholder="Qual vai ser o nome da sua comunidade?" 
                  name="title" 
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"/>
              </div>
              
              <div>
                <input 
                  placeholder="Coloque uma URL para usarmos de capa" 
                  name="image" 
                  aria-label="Coloque uma URL para usarmos de capa"/>
              </div>

              <button>
                Criar comunidade
              </button>

            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{gridArea:'profileRelationsArea'}}>
        <ProfileRelationsBoxWrapper>
          <h2 className='smallTitle'>Pessoas GIT ({pessoasGitHub.length})</h2>
          <ul>
            {
              pessoasGitHub.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={itemAtual.html_url}>
                      <img src={itemAtual.avatar_url}/>
                      <span>{itemAtual.login}</span>
                    </a>
                  </li>
                )
              })
            }
            </ul>
          </ProfileRelationsBoxWrapper>
          {/* <ProfileRelationsBoxWrapper>
          <h2 className='smallTitle'>Comunidades ({comunidades.length})</h2>
          <ul>
            {
              comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/users/${itemAtual.descricao}`}>
                      <img src={itemAtual.image}/>
                      <span>{itemAtual.descricao}</span>
                    </a>
                  </li>
                )
              })
            }
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className='smallTitle'>Pessoas da comunidade ({pessoasFavoritas.length})</h2>
            <ul>
            {
              pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual.login}>
                    <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual.login}.png`}/>
                      <span>{itemAtual.login}</span>
                    </a>
                  </li>
                )
              })
            }
            </ul>
          </ProfileRelationsBoxWrapper> */}

          <BoxImageLabel propriedades={propriedadesComunidades}/>
          <BoxImageLabel propriedades={propriedadesPessoas}/>
         
        </div>
      </MainGrid>
    </>
  )
}
