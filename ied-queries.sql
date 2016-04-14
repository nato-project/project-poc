select distinct region from ied order by region

update ied set region_id='zp' where region='ZAPORIZHIA'

select * from ied where map_xml is null

select * from ied where region_id is null

update ied set region='ZHYTOMYR' where region='ZHITOMYR'

select * from ied where city='Nikolaev' -- 	Zaporizhia

update ied set region='ZAPORIZHIA',map_xml=null where region='ZAPORIZHYE'

select * from ied where region in ('LUHANSK','LUHANKS')


update ied set city='Nikolaev' where city='Nikolayevshchina'

select id,date,type,kia,wia,text from ied

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

update ied set region='KIEV' where region='�KIEV'

update ied set country='UKRAINE' where country='UKRAINE�'


--update ied set map_xml=null where LOCATION_LAT is null

update ied set [type]=rtrim([type])



ZAPORIZHYE => ZAPOROZHYE 
MIKOLAYIV => MYKOLAIV
LUHANKS=> LUGANSK


select id,[date],[type],kia,wia,city,region,region_id,[text],LOCATION_LAT as lat,LOCATION_LNG lng from ied

