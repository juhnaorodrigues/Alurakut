import { ProfileRelationsBoxWrapper } from "../ProfileRelations"

export function BoxImageLabel({ propriedades }) {
    return (
    <ProfileRelationsBoxWrapper>
        <h2 className='smallTitle'>{propriedades.descricao} ({propriedades.lista.length})</h2>
        <ul>
            {
                propriedades.lista.map((itemAtual) => {
                    return (
                        <li key={itemAtual.id}>
                            <a href={`/users/${itemAtual.descricao}`}>
                                <img src={itemAtual.image} />
                                <span>{itemAtual.descricao}</span>
                            </a>
                        </li>
                    )
                })
            }
        </ul>
    </ProfileRelationsBoxWrapper>
)}