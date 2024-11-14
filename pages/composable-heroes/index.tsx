import React, { useState, useEffect } from 'react';
import { onEntryChange } from '../../contentstack-sdk';
import HeroesList from '../../components/heroes-list';
import RenderComponents from '../../components/render-components';
import { getPageRes, getHeroesListRes } from '../../helper';

import ArchiveRelative from '../../components/archive-relative';
import Skeleton from 'react-loading-skeleton';
import { Page, PostPage, PageUrl, Context } from "../../typescript/pages";


export default function Blog({ page, posts, archivePost, pageUrl }: {page: Page, posts: PostPage, archivePost: PostPage, pageUrl: PageUrl}) {

  const [getBanner, setBanner] = useState(page);
  async function fetchData() {
    try {
      const bannerRes = await getPageRes(pageUrl);
      if (!bannerRes) throw new Error('Status code 404');
      setBanner(bannerRes);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    onEntryChange(() => fetchData());
  }, []);
  return (
    <>
      {getBanner.page_components ? (
        <RenderComponents
          pageComponents={getBanner.page_components}
          heroesPost
          contentTypeUid='page'
          entryUid={getBanner.uid}
          locale={getBanner.locale}
        />
      ) : (
        <Skeleton height={400} />
      )}
      <div className='blog-container'>
        <div className='blog-column-left'>
          {posts ? (
            posts.map((heroesList, index) => (
              <HeroesList heroeslist={heroesList} key={index} />
            ))
          ) : (
            <Skeleton height={400} width={400} count={3} />
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: Context) {
  try {
    const page = await getPageRes(context.resolvedUrl);
    const result = await getHeroesListRes();

    const archivePost = [] as any;
    const posts = [] as any;
    result.forEach((heroes) => {
      if (heroes.is_archived) {
        archivePost.push(heroes);
      } else {
        posts.push(heroes);
      }
    });
    return {
      props: {
        pageUrl: context.resolvedUrl,
        page,
        posts,
        archivePost,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}
