function Icon(props) {
    return (
        <div className="icon">
            <a href="http://localhost:3000/profile">
            <img src={props.imageUrl} alt="icon"></img>
            </a>
        </div>
    );
}

export default Icon;