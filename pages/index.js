import MainGrid from '../src/components/MainGrid'
import nookies from 'nookies'
import jwt from 'jsonwebtoken'
import React, { useEffect, useState } from  'react'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';


function ProfileSidebar(propriedades) {
  console.log(propriedades);
  return (
    <Box as="aside">
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />
      <p>
        <a className="boxLink" href={`github.com/${propriedades.githubUser}`}>
          {propriedades.githubUser}
        </a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}



function ProfileRelationBox(propriedades){
   return(
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title}({propriedades.item.length})
      </h2>
        <ul>
        {propriedades.item.slice(0,6).map((item) =>{
            return (
              <li key={item.id}>
                {
                  item.avatar_url ?
                  <a href={`https://github.com/${item.login}`} target="_blank" key={item.login}>
                    <img src={item.avatar_url}/>
                    <span>{item.login}</span>
                  </a> : item.imageUrl ?

                    <a href={`/comunidades/${item.id}`} key={item.title}>
                    <img src={item.imageUrl}/>
                    <span>{item.title}</span>
                    </a> :
                      
                    <a href={`https://github.com/${item.full_name}`} target="_blank" key={item.name}>
                    <img src={'https://github.com/github.png'}/>
                    <span>{item.name}</span>
                    </a> 
                }
              </li>
            )
            })}  
        </ul>
      {
        propriedades.item.length > 6 ?
          <a className="boxLink">mostrar mais</a> :
          <h2></h2>
      }
    </ProfileRelationsBoxWrapper>
  )
}




export default function Home(props) {
  const usuarioAleatorio = props.githubUser;
  const [subs, setSubs] = useState([])
  const [seguindo, setSeguindo] = useState([])
  const [comunidades, setComunidades] = useState([]);
  
  useEffect(function() {
    fetch(`https://api.github.com/users/${usuarioAleatorio}/starred`)
    .then(function (response) {
      return response.json();
    })
    .then(function (dados){
      setSubs(dados)
    })
  }, [])

  useEffect(function() {
    fetch(`https://api.github.com/users/${usuarioAleatorio}/following`)
    .then(function (response) {
      return response.json();
    })
    .then(function (dados){
      setSeguindo(dados)
    })

    //comunidades
    fetch(`https://graphql.datocms.com/`,{
      method: 'POST', 
      headers:{
        'Authorization':'21463a1c74173b8c2b0addb0f4d1f0',
        'Content-Type':'application/json', 
        'Accept': 'application/json'},
      body: JSON.stringify({'query':`
        query {
          allCommunities {
            id
            title
            imageUrl
            creatorSlug
          }
        }
      `})}
    )
    .then((resposta) => resposta.json() )
    .then((respDados) =>{
      const responseData  = respDados.data.allCommunities
      setComunidades(responseData)
    })
  }, [])

  return (
    <>
      <AlurakutMenu  githubUser={usuarioAleatorio} />
      <MainGrid>
        {/* <Box style="grid-area: profileArea;"> */}
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a) 
            </h1>

            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">Oque você deseja fazer?</h2>
            <form onSubmit={function handleSubmit(e){
              e.preventDefault();
              const dadosForm = new FormData(e.target);
              const comunidade={
                title: dadosForm.get('title'),
                imageUrl: dadosForm.get('image'),
                creatorSlug: usuarioAleatorio
              }

              fetch('/api/comunidades',{
                method: "POST",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(comunidade)
              })
              .then(async (response) => {
                const dados = await response.json();
                console.log(dados)
              })

              setComunidades([...comunidades,comunidade])
            }}>
              <div>
                <input placeholder="Qual vai ser o nome da sua comunidade?" type="text" name="title" aria-label="Qual vai ser o nome da sua comunidade"/>
              </div>
              <div>
                <input placeholder="Coloque a URL para usarmos de capa" name="image" type="text" aria-label="Coloque a URL para usarmos de capa"/>
              </div>
              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
          
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationBox title="pessoas da comunidade"  item={seguindo}/> 
          <ProfileRelationBox title="projetos"  item={subs}/> 
          <ProfileRelationBox title="Comunidades"  item={comunidades}/>          
        </div>
      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context){
  const token = nookies.get(context).USER_TOKEN
  

  const {isAuthenticated} = await fetch('https://alurakut.vercel.app/api/auth',{
    headers:{
      Authorization: token
    }
  })
  .then(()=> resposta.json)

  if(!isAuthenticated){
    return{
      redirect:{
        destination: '/login',
        permanent: false
      }
    }
  }

  const {githubUser} = jwt.decode(token)

  return{
    props: {
      githubUser
    },
  }
}