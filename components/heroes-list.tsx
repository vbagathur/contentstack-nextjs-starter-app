import React from 'react';
import moment from 'moment';
import parse from 'html-react-parser';
import Link from 'next/link';
import { Image } from "../typescript/action";

type AdditionalParam = {
  banner_title:string;
  banner_description: string;
  title_h2: string;
  description: string;
  date: string;
}

type Author = {
  name: string;
  $: AdditionalParam;
}


type HeroeslistProps = {
  description: string;
  url: string;
  image: Image; 
  name: string;
  title: string;
  date: string;
  author: [Author];
  $: AdditionalParam;
}

function HeroesList({ heroeslist }: { heroeslist: HeroeslistProps }) {
  let description: string = heroeslist.description && heroeslist.description;
  const stringLength = description.length;
  description = `${description}...`;
  return (
    <div className='blog-list'>
      {heroeslist.image && (
        (<Link href={heroeslist.url}>

          <img
            className='blog-list-img'
            src={heroeslist.image.url}
            alt='blog img'
            {...heroeslist.image.$?.url as {}}
          />

        </Link>)
      )}
      <div className='blog-content'>
        {heroeslist.title && (
          (<Link href={heroeslist.url}>

            <h3>{heroeslist.title}</h3>

          </Link>)
        )}
        <p>
          <strong {...heroeslist.$?.date as {}}>
            {moment(heroeslist.date).format('ddd, MMM D YYYY')}
          </strong>
          ,{" "}
        </p>
        {heroeslist.url ? (
          (<Link href={heroeslist.url}>

            <span>{'Read more -->'}</span>

          </Link>)
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export default HeroesList;