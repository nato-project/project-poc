select * from topwords

select id,word_1,word_2,word_3 from topwords order by id

select s_id,count(t_id) links
from cs_links 
where cs_value >=0.5
group by s_id
order by links desc

select tw.id,tw.word_1,tw.w1_value,tw.w1_fs,tw.word_2,tw.w2_value,tw.w2_fs,tw.word_3,tw.w3_value,tw.w3_fs
,twc.id as child_id,twc.word_1,twc.w1_value,twc.w1_fs,twc.word_2,twc.w2_value,twc.w2_fs,twc.word_3,twc.w3_value,twc.w3_fs
from topwords tw
inner join cs_links csl on (tw.id=csl.s_id and csl.cs_value >=0.5)
inner join topwords twc on (csl.t_id = twc.id)
where tw.id=24

select t_id,count(s_id) links
from cs_links 
where cs_value >=0.5
group by t_id
order by links 


select distinct region,region_id from ied order by region_id

update ied set region_id='zp' where region='ZAPORIZHIA'

select * from ied where map_xml is null

select * from ied where region_id is null

update ied set region='ZHYTOMYR' where region='ZHITOMYR'

select * from ied where city='Nikolaev' -- 	Zaporizhia

update ied set region='ZAPORIZHIA',map_xml=null where region='ZAPORIZHYE'

select * from ied where region in ('LUHANSK','LUHANKS')


update ied set city='Nikolaev' where city='Nikolayevshchina'

select id,date,type,kia,wia,text from ied

select * from region_stats

select count(*) from ied
select distinct [type] from ied
select sum(kia),sum(wia),count(id) from ied
select distinct region from ied order by region
select distinct country from ied

select region,sum(kia),sum(wia)
from ied
group by region
having sum(kia)>0 or sum(wia) >0


select [type],sum(kia),sum(wia),count(id)
from ied
group by [type]
having sum(kia)>0 or sum(wia) >0

update ied set region='KIEV' where region='¾KIEV'

update ied set country='UKRAINE' where country='UKRAINE¾'


--update ied set map_xml=null where LOCATION_LAT is null

update ied set [type]=rtrim([type])

select count(*) from cs_links

select cs.s_id,cs.t_id,cs.cs_value,s.text,t.text
from cs_text_all cs
inner join ied s on (cs.s_id=s.id)
inner join ied t on (cs.t_id=t.id)
where 1=1
--and cs.cs_value >= 0.3
and (s_id =50 or t_id=50)
--and s_id=50
--and t_id=50
order by s_id

select cs.s_id,cs.t_id,cs.cs_value,s.text,t.text
from cs_links cs
inner join ied s on (cs.s_id=s.id)
inner join ied t on (cs.t_id=t.id)
where 1=1
and cs.cs_value >= 0.5
--and (s_id =50 or t_id=50)
--and s_id=50
--and t_id=50
order by s_id

select count(*) from cs_links
-- delete from cs_links

ZAPORIZHYE => ZAPOROZHYE 
MIKOLAYIV => MYKOLAIV
LUHANKS=> LUGANSK


select id,[date],[type],kia,wia,city,region,region_id,[text],LOCATION_LAT as lat,LOCATION_LNG lng from ied


insert into region_stats values('ck',20891,1291135,61.8);
insert into region_stats values('cn',31851,1104241,34.67);
insert into region_stats values('cv',8094,903782,111.67);
insert into region_stats values('dp',31901,3344073,104.83);
insert into region_stats values('dn',26506,4448031,167.81);
insert into region_stats values('if',13894,1380770,99.38);
insert into region_stats values('kh',31402,2755177,87.74);
insert into region_stats values('ks',28449,1091151,38.35);
insert into region_stats values('kiev',28119,1719602,61.15);
insert into region_stats values('lg',26673,2300412,86.25);
insert into region_stats values('lviv',21824,2545634,116.65);
insert into region_stats values('mk',24587,1186452,48.25);
insert into region_stats values('od',33296,2387636,71.71);
insert into region_stats values('pl',28736,1493668,51.98);
insert into region_stats values('rv',20039,1152576,57.52);
insert into region_stats values('sm',23824,1166765,48.97);
insert into region_stats values('te',13817,1086694,78.65);
insert into region_stats values('vn',26502,1646250,62.12);
insert into region_stats values('volyn',20135,1038223,51.56);
insert into region_stats values('uz',12772,1246323,97.59);
insert into region_stats values('zp',27169,1805431,66.45);
insert into region_stats values('zt',29819,1283201,43.03);

insert into region_stats values('km',20636,1331534,64.52);
insert into region_stats values('kr',24578,1014809,41.29);
insert into region_stats values('crimea',26100,1966801,75);

