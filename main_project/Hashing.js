function sha3(str)
{
    output= "";
    for (var i = 0; i < str.length; i++) {
        output += str[i].charCodeAt(0).toString(2);
    }
    console.log("Input String : ",str)
    return sponge(output,256)
    function theta(a)
    {
        let a_=createarray()
        let c=new Array()
        for(let i=0;i<5;i++)
            {
                c.push(new Array())
                for(let k=0;k<64;k++)
                    {
                        let f=a[k][0][i]
                        for(let j=1;j<5;j++)
                            {
                                f=f_xor(f,a[k][j][i])
                            }
                        c[i].push(f)
                    }
            }
        let d=new Array()
        for(let i=0;i<5;i++)
            {
                d.push(new Array())
                for(let k=0;k<64;k++)
                    {
                        d[i].push(f_xor(c[((i-1)%5+5)%5][k],c[(i+1)%5][((k-1)%64+64)%64]))
                    }
            }
        for(let i=0;i<5;i++)
            {
                for(let j=0;j<5;j++)
                    {
                        for(let k=0;k<64;k++)
                            {
                                a[k][i][j]=f_xor(a[k][i][j],d[j][k])
                            }
                    }
            }
        //console.log(a.length)
        return a
    }
    function rho(a)
    {
        let a_=createarray()
        for(let k=0;k<64;k++)
            {
                a_[k][0][0]=a[k][0][0]
            }
        let j=1,i=0
        //gh=[[0,0,0,0,0,],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0,],[0,0,0,0,0]]
        for(let t=0;t<24;t++)
            {
                for(let k=0;k<64;k++)
                    {
                        
                        let m=((k-Math.floor(((t+1)*(t+2))/2))%64+64)%64
                        //gh[i][j]=Math.abs(k-m)
                        a_[k][i][j]=a[m][i][j]
                    }
                let temp=i
                i=j
                j=(2*temp + 3*j)%5
            }
        //console.log(gh)
        return a_
    }
    function pi(a)
    {
        let a_=createarray()
        for(let i=0;i<5;i++)
            {
                for(let j=0;j<5;j++)
                    {
                        for(let k=0;k<64;k++)
                            {
                                    a_[k][i][j]=a[k][(i+3*j)%5][i] 
                                    //console.log([i,j],[(i+3*j)%5,i])
                                    
                            }
                    }
            }
        return a_
        
    }
    function chi(a)
    {
        let a_=createarray()
        for(let k=0;k<64;k++)
            {
                for(let i=0;i<5;i++)
                    {
                        for(let j=0;j<5;j++)
                            {
                                let n=parseInt(a[k][i][j])
                                let m1=parseInt(a[k][i][(j+1)%5])^1
                                let m2=parseInt(a[k][i][(j+2)%5])
                                m1=m1&m2
                                n=n^m1
                                a_[k][i][j]=n.toString(2)
                            }
                    }
            }
        return a_
    }
    function rc(t)
    {
        if(t%255==0)
            {
                return "1"
            }
        let r="10000000"
        for(let i=1;i<(t%255)+1;i++)
            {
                r="0"+r
                r=r.split("")
                r[0] = f_xor(r[0],r[8])
                r[4] = f_xor(r[4],r[8])
                r[5] = f_xor(r[5],r[8])
                r[6] = f_xor(r[6],r[8])
                r = r.join("").substring(0,8)
            }
        return r[0]
    }
    function bin2hex(b) {
        return b.match(/.{4}/g).reduce(function(acc, i) {
            return acc + parseInt(i, 2).toString(16);
        }, '')
    }
    function iota(a,ir)
    {
        let RC=zero(64)
        Rc=RC.split("")
        for(let i=0;i<7;i++)
            {
                let h=rc(i+(7*ir))
                //console.log(h)
                Rc[Math.pow(2,i)-1]=h
            }
        Rc=Rc.reverse()
        // Rc=Rc.join("")
        // console.log(bin2hex(Rc),ir)
        for(let k=0;k<64;k++)
            {
                a[k][0][0]=f_xor(a[k][0][0],RC[k])
            }
        return a
    }
    function createarray()
    {
        let a=new Array()
        for(let i=0;i<64;i++)
            {
                a.push(new Array())
                for(let j=0;j<5;j++)
                    {
                        a[i].push(["0","0","0","0","0"])
                    }
            }
        return a
    }
    function keccak(b,n)
    {
        
        let a=createarray()
        let index=0
        for(let i=0;i<5;i++)
            {
                for(let j=0;j<5;j++)
                    {
                        for(let k=0;k<64;k++)
                            {
                                a[k][i][j]=b[index]
                                index+=1
                            }
                    }
            }
        //console.log("index",index)
        for(let ir=0;ir<24;ir++)
            {
                a=theta(a)
                a=rho(a)
                a=pi(a)
                a=chi(a)
                a=iota(a,ir)
            }
        let s_=""
        for(let i=0;i<5;i++)
            {
                for(let j=0;j<5;j++)
                    {
                        for(let k=0;k<64;k++)
                            {
                                s_+=a[k][i][j]
                            }
                    }
            }
        return s_
    }
    function f_xor(a,b)
    {
        if((a=="0" && b=="0") || (a=="1" && b=="1"))
        {
                return "0"
        }
        return "1"
    }
    function xor(x,y)
    {
        let re=""
        for (let i=0;i<1600;i++)
            {
                if((x[i]=="0" && y[i]=="0") || (x[i]=="1" && y[i]=="1"))
                    {
                        re+="0"
                    }
                else{
                    re+="1"
                }
            }
        return re
    }
    function zero(d)
    {
        let re=""
        for(let i=0;i<d;i++)
            {
                re+="0"
            }
        return re
        
    }
    function pad(x,m)
    {
        let p=((-m-2)%x+x)%x
        let re="1"
        re+=zero(p)
        return re+"1"
    }
    function sponge(n,d)
    {
        
        //console.log("Input String : ",n)
        let r=576
        n=n+pad(r,n.length)
        //console.log("Partitions : ",n.length/576)
        let s=zero(1600)
        let c=zero(1024)
        let initial=0
        for(let i=0;i<n.length/r;i++)
            {
            d=xor(s,n.substring(initial,initial+r)+c)
            //console.log(d,"\n")
            s=keccak(d,24)
            initial+=r
            }
        let z=s.substring(0,256)
        return bin2hex(z)
    }

}

module.exports=sha3;