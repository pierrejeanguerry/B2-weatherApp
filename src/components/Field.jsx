export default function Field(props) {
  function handleChange(event) {
    props.onChange(event.target.value);
  }
  return (
    <div className="mb-4">
      <input
        className={`shadow appearance-none border ${
          props.boolean ? "border-red-500" : ""
        } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
        type={props.type}
        name={props.name}
        id={props.id}
        value={props.value}
        onChange={handleChange}
        placeholder={props.placeholder}
        required
      />
      <p className="text-red-500 text-xs italic">
        {props.boolean ? props.errorText : <br />}
      </p>
    </div>
  );
}
