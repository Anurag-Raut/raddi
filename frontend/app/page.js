"use client"
import axios from "axios";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [replacements, setReplacement] = useState([]);
  const [outputFilename, setOutputFilename] = useState("output.pdf");
  async function uploadFile() {
    try {


      const formData = new FormData();
      formData.append("file", file);
      formData.append("replacements", JSON.stringify(replacements));
      formData.append("output_filename", outputFilename+".pdf");



      await axios.post("https://raddi.onrender.com/upload-pdf", formData, {
        responseType: 'blob'
      })
        .then((res) => {
          const downloadUrl = URL.createObjectURL(res.data);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.setAttribute('download', outputFilename+'.pdf'); // Set the desired file name
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);


        })
        .catch((err) => {
          console.log(err);
        });
    }
    catch (err) {
      console.log(err);
    }

  }

  function addReplacements() {
    const search = document.querySelector("#search").value;
    const replace = document.querySelector("#replace").value;

    setReplacement([...replacements, { search, replace }]);
    //remove the values from the input fields
    document.querySelector("#search").value = "";
    document.querySelector("#replace").value = "";

    console.log(replacements);
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex items-end">

      <input onChange={(e) => setFile(e.target.files[0])} type="file" className="file-input file-input-bordered w-full max-w-xs" />
      <div className="mx-3 ">
        <h1 className="my-2">
          output filename
        </h1>
      <input onChange={(e)=>setOutputFilename(e.target.value)} id="output filename" type="text" placeholder="Type here" className="input w-full max-w-xs" />
        </div>

        </div>
      <div>
        <div className="flex flex-col items-end">
          <div className="flex">
            <div className="mx-3">
              <h1>search </h1>
              <input id="search" type="text" placeholder="Type here" className="input w-full max-w-xs" />
            </div>
            <div className="mx-3">
              <h1>replace </h1>
              <input id="replace" type="text" placeholder="Type here" className="input w-full max-w-xs" />
            </div>


          </div>
          <button onClick={addReplacements} className="btn m-5">add</button>

        </div>
        <div className="flex flex-col">
          <h1>Replacements</h1>
          <ul>
            {replacements.map((replacement, index) => {
              return <li key={index}>{replacement.search} {"->"} {replacement.replace}</li>
            })}
          </ul>
        </div>

      </div>
      <button onClick={uploadFile} className="btn">upload</button>

    </main>
  );
}
