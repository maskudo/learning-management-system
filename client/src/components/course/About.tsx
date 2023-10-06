export default function About({ info }) {
  return (
    <div className="info flex flex-col gap-4">
      <div className="description pr-52">
        <h3 className="text-2xl">Description</h3>
        <p className="text-justify text-[1rem]">{info.description}</p>
      </div>
      <div className="abstract pr-52">
        <h3 className="text-2xl">Abstract</h3>
        <p className="text-justify text-[1rem]">{info.abstract}</p>
      </div>
    </div>
  );
}
