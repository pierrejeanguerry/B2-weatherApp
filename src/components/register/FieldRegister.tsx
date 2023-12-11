import { HTMLInputTypeAttribute } from "react";

export default function FieldRegister({
  type,
  name,
  boolean,
  id,
  value,
  placeholder,
  errorText,
  onChange,
}: {
  type: HTMLInputTypeAttribute;
  name: string;
  boolean: Boolean | null;
  id: string;
  value: string;
  placeholder: string;
  errorText: String | null;
  onChange: Function;
}) {
  function handleChange(event: any) {
    onChange(event.target.value);
  }
  return (
    <div className="mb-4">
      <input
        className={`shadow appearance-none border ${
          boolean ? "border-red-500" : ""
        } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
        type={type}
        name={name}
        id={id}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required
      />
      <p className="text-red-500 text-xs italic">
        {boolean ? errorText : <br />}
      </p>
    </div>
  );
}
