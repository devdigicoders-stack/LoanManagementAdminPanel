export default function InputError({ message }) {
  if (!message) return null;
  return (
    <p className="text-[12px] text-red-500 font-medium mt-1">
      {message}
    </p>
  );
}
