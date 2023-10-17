import xml2js from "xml2js";
import React, { FunctionComponent } from "react";
import { ShieldCheckIcon } from "@heroicons/react/20/solid";
import Image from "next/image";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { pb } from "@/lib/pb";
import { AppProps } from "next/app";

async function getNote(noteId: string) {
  const res = await fetch(
    `https://notes-hub.fly.dev/api/collections/songs/records/${noteId}`,
    {
      next: { revalidate: 10 },
    }
  );
  const data = await res.json();
  return data;
}

export default async function NotePage({ params }: any) {
  const song_id = params.id;

  const song_details = await pb.collection("songs").getOne(song_id);

  const song = await getNote(params.id);

  let jsx: any;

  const xml: string = song_details.verses;

  xml2js.parseString(xml, function (err: any, result: any) {
    if (err) {
      console.log(err);
    } else {
      const songTitle = result.song.$.version;
      const lyrics = result.song.lyrics[0].verse;
      jsx = lyrics;
    }
  });

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        <div className="lg:max-w-lg lg:self-end">
          <div className="mt-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {song.title}
            </h1>
          </div>
          <section aria-labelledby="information-heading" className="mt-4">
            <h2 id="information-heading" className="sr-only">
              Product information
            </h2>

            <div className="mt-4 space-y-6">
              <p className="text-base text-gray-500">{song.content}</p>
            </div>
            <div className="mt-6 flex items-center">
              <p className="ml-2 text-sm text-gray-500">{song.author}</p>
            </div>

            <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
              {/* <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg">
                <Image
                  width={150}
                  height={150}
                  src={`https://notes-hub.fly.dev/api/files/qzw10hvf1b4j777/${song.id}/${song.image}`}
                  alt={song.title}
                />
              </div> */}
            </div>
          </section>
          <section>
            <div className="mt-6  text-gray-500 text-xl">
              {jsx.map((verse: any) => {
                // replace \n with <br />
                const v = verse?._.replace("\n", "<br />");
                return (
                  <div
                    className="mb-8"
                    dangerouslySetInnerHTML={{ __html: v }}
                  ></div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <section aria-labelledby="options-heading">
            <h2 id="options-heading" className="sr-only">
              Product options
            </h2>

            <form>
              <div className="mt-4"></div>
              <div className="mt-6 text-center">
                <a href="#" className="group inline-flex text-base font-medium">
                  <ShieldCheckIcon
                    className="mr-2 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  <span className="text-gray-500 hover:text-gray-700">
                    Lifetime Guarantee
                  </span>
                </a>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
