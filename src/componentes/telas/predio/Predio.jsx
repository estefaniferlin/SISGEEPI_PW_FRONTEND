import { useState, useEffect } from "react";
import PredioContext from "./PredioContext";
import Tabela from "./Tabela";
import Form from "./Form";

function Predio(){

    const [alerta, setAlerta] = useState({status : "", message : ""});
    const [listaObjetos, setListaObjetos] = useState([]);
    const [editar, setEditar] = useState(false);
    const [objeto, setObjeto] = useState({codigo : "", nome : "", descricao : "", sigla : ""});

    const recuperar = async codigo => {
        await fetch(`${process.env.REACT_APP_ENDERECO_API}/predios/${codigo}`)
            .then(response => response.json())
            .then(data => setObjeto(data))
            .catch(err => console.log('Erro: ' + err))
    }

    const acaoCadastrar = async e => {
        e.preventDefault();
        const metodo = editar ? "PUT" : "POST"; // se for editar, faz put, senao post
        try{
            await fetch(`${process.env.REACT_APP_ENDERECO_API}/predios`, 
            {
                method : metodo,
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify(objeto)
            })
            .then(response => response.json())
            .then(json => {
                setAlerta({status : json.status, message : json.message});
                setObjeto(json.objeto);
                if(!editar){ // se nao esta editando
                    setEditar(true); // sera um obj que é editado, nao um novo
                }
            })
        }catch(err){
            console.log(err.message);
        }
        recuperaPredios();
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setObjeto({...objeto, [name] : value}) // no atributo name vou colocar o valor recebido (codigo, sigla, ..) e joga pra dentro do objeto
        console.log(JSON.stringify(objeto))
    }

    const recuperaPredios = async () => {
        await fetch(`${process.env.REACT_APP_ENDERECO_API}/predios`)
            .then(response => response.json())
            .then(data => setListaObjetos(data))
            .catch(err => console.log('Erro: ' + err))
    }

    const remover = async objeto => {
        if(window.confirm('Deseja remover este objeto?')){
            try{
                await fetch(`${process.env.REACT_APP_ENDERECO_API}/predios/${objeto.codigo}`, {method : "DELETE"})
                    .then(response => response.json())
                    .then(json => setAlerta({status : json.status, message : json.message}))
                    recuperaPredios();
                
            }catch(err){
                console.log('Erro: ' + err)
            }
        }
    }

    useEffect(() => {
        recuperaPredios();
    }, []);

    return (
        <PredioContext.Provider value ={
            {
                alerta, setAlerta,
                listaObjetos, setListaObjetos,
                recuperaPredios,
                remover,
                objeto, setObjeto,
                editar, setEditar,
                recuperar,
                acaoCadastrar, handleChange
            }
        }>
            <Tabela/>
            <Form/>
        </PredioContext.Provider>
    )
}

export default Predio;