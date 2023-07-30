import students from "./students";

function getStudentCards(student){
  return (
    <Card
      key={student.id}
      name={student.name}
      university={student.university}
    />
  )
}

const Card = (props) => {

  return(
    <div className="card">
      <h3>{props.name}</h3>
      <p><span> - </span>{props.university}</p>
    </div>
  );
}

function App() {
  return (
    <div className="container">
      {students.map(getStudentCards)}
    </div>
  );
}

export default App;
