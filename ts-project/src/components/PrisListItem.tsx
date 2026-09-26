import "../Boka.css";

interface Props {
  prisOnamn: [string, number][];
  titel: string;
}

const PrisLititem = ({ prisOnamn, titel }: Props) => {
  let maxindex = prisOnamn.length;

  const elements = [];

  for (let i = 0; i < maxindex; i++) {
    elements.push(
      <li className="list-group-item d-flex justify-content-between">
        {prisOnamn[i][0]}
        <span className="">{prisOnamn[i][1]} kr</span>
      </li>
    );
  }

  return (
    <>
      <h5>{titel}</h5>
      <ul className="list-group list-group-flush ulstyle">{elements}</ul>
    </>
  );
};

export default PrisLititem;
