import React, { useEffect, useState } from 'react';
import moment from 'moment';
import parse from 'html-react-parser';
import { getPageRes, getHeroesPostRes } from '../../helper';
import { onEntryChange } from '../../contentstack-sdk';
import Skeleton from 'react-loading-skeleton';
import RenderComponents from '../../components/render-components';
import ArchiveRelative from '../../components/archive-relative';
import { Page, Heroes, PageUrl } from "../../typescript/pages";


export default function HeroesPost({ heroesPost, page, pageUrl }: {heroesPost: Heroes, page: Page, pageUrl: PageUrl}) {
  
  const [getPost, setPost] = useState({ banner: page, post: heroesPost });
  async function fetchData() {
    try {
      const entryRes = await getHeroesPostRes(pageUrl);
      const bannerRes = await getPageRes('/composable-heroes');
      if (!entryRes || !bannerRes) throw new Error('Status: ' + 404);
      setPost({ banner: bannerRes, post: entryRes });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    onEntryChange(() => fetchData());
  }, [heroesPost]);

  const { post, banner } = getPost;
  return (
    <>
      {banner ? (
        <RenderComponents
          pageComponents={banner.page_components}
          heroesPost
          contentTypeUid='character'
          entryUid={banner?.uid}
          locale={banner?.locale}
        />
      ) : (
        <Skeleton height={400} />
      )}
      <div className='blog-container'>
        <article className='blog-detail'>
          {post && post.title ? (
            <h2>{post.title}</h2>
          ) : (
            <h2>
              <Skeleton />
            </h2>
          )}
         Powers:  {post && post.powers ? (
            <p> {post.powers}
            </p>
          ) : (
            <p>
              <Skeleton width={300} />
            </p>
          )}
          {post && post.image ? (
            <p> <img src={post.image.url} alt={post.title}/>
            </p>
          ) : (
            <p>
              <Skeleton width={300} />
            </p>
          )}
        </article>
      </div>
    </>
  );
}
export async function getServerSideProps({ params }: any) {
  try {
    const page = await getPageRes('/composable-heroes');
    const posts = await getHeroesPostRes(`/composable-heroes/${params.post}`);
    if (!page || !posts) throw new Error('404');

    return {
      props: {
        pageUrl: `/composable-heroes/${params.post}`,
        heroesPost: posts,
        page,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}
