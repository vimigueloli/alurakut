import MainGrid from '../src/components/MainGrid'
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
  function top(lista){
    return lista[Math.floor(Math.random() * lista.length)];
  }
  const lista = [top(propriedades.item),top(propriedades.item),top(propriedades.item),top(propriedades.item),top(propriedades.item),top(propriedades.item)]
  return(
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title}({propriedades.item.length})
      </h2>
        <ul>
        {propriedades.item.splice(1,6).map((item) =>{
            return (
              <li key={item.id}>
                {
                  item.avatar_url ?
                  <a href={`https://github.com/${item.login}`} target="_blank" key={item.login}>
                    <img src={item.avatar_url}/>
                    <span>{item.login}</span>
                  </a> :
                  <a href={`https://github.com/${item.full_name}`} target="_blank" key={item.full_name}>
                  <img src={'https://github.com/github.png'}/>
                  <span>{item.name}</span>
                </a>
                }
              </li>
            )
            })}  
        </ul>
    </ProfileRelationsBoxWrapper>
  )
}




export default function Home() {
  const [comunidades, setComunidades] = React.useState([{
    id: '12122112121121211121221212',
    titulo: 'eu odeio acordar cedo',
    imagem: 'https://alurakut.vercel.app/capa-comunidade-01.jpg'
  }]);
  const usuarioAleatorio = 'vimigueloli';
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ]

  const [subs, setSubs] = useState([])
  const [seguindo, setSeguindo] = useState([])
  
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
  }, [])

  return (
    <>
      <AlurakutMenu />
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
                id: new Date().toISOString(),
                titulo: dadosForm.get('title'),
                imagem: dadosForm.get('image')
              }
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
            <ProfileRelationBox title="projetos seguidos"  item={subs}/>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades({comunidades.length})
            </h2>
            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/users/${itemAtual.titulo}`} key={itemAtual.titulo}>
                      <img src={itemAtual.imagem}/>
                      <span>{itemAtual.titulo}</span>
                    </a>
                  </li>
                )
              })}  
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}
