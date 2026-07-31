import './Summ.css';

function Summ(props){
    return(
        <div className="summ-card">
            <h1>{props.name}</h1>
            <h2>{props.age}</h2>
            <h5>{props.description}</h5>
        </div>
    )
}
export default Summ;
